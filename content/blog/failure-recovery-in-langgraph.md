---
title: "LangGraph에서 실패를 복구하는 에이전트 설계"
date: 2026-07-28
tag: Agent
summary: "재시도만으로는 부족하다. 상태를 되감는 복구 루프를 그래프에 넣은 과정."
draft: false
---

## 재시도는 상태를 되돌리지 않는다

도구 호출이 실패하면 대부분의 구현은 같은 노드를 다시 호출한다. 문제는 실패 직전에 쓰기 작업이 이미 절반쯤 일어난 경우다. 이때 재시도는 깨끗한 상태가 아니라 부분 적용된 상태 위에 다시 쓰는 셈이 된다.

우리 파이프라인에서 이 증상은 항상 같은 모양으로 나타났다. 문서 인덱싱 에이전트가 벡터 스토어에 절반을 올린 뒤 타임아웃으로 죽고, 재시도가 나머지를 올리면서 앞부분을 중복으로 한 번 더 올린다. 로그만 보면 성공이다.

## 복구를 그래프 안으로 옮긴다

`try/except`로 감싸는 대신, 되감기를 그래프의 노드로 만들었다. 실패는 예외가 아니라 엣지다.

```python
graph.add_node("write", write_documents)
graph.add_node("recover", rollback_to_checkpoint)

graph.add_conditional_edges(
    "write",
    lambda state: "recover" if state["error"] else "verify",
    {"recover": "recover", "verify": "verify"},
)
```

이렇게 두면 복구 경로도 다른 노드와 똑같이 관측된다. 어떤 실행이 몇 번 되감겼는지, 되감기 자체가 실패한 적은 없는지 트레이스에 그대로 남는다.

## 체크포인트는 노드 단위로

되감을 지점이 없으면 복구 노드는 할 일이 없다. 우리는 쓰기 노드에 진입할 때마다 그 노드가 건드릴 리소스의 스냅샷 ID를 상태에 적었다.

```python
def write_documents(state: State) -> State:
    checkpoint = store.snapshot(namespace=state["run_id"])
    return {**state, "checkpoint": checkpoint, ...}
```

스냅샷은 전체 스토어가 아니라 `run_id` 네임스페이스만 대상으로 한다. 전체를 뜨면 비용이 실행 시간에 비례해 커지고, 결국 아무도 켜두지 않는다.

## 운영에서 배운 것

복구 루프를 넣은 뒤 실패율 자체는 변하지 않았다. 바뀐 것은 실패의 성질이다. 이전에는 부분 적용된 상태가 조용히 남아 다음 실행을 오염시켰고, 지금은 실패한 실행이 흔적 없이 사라진다.

한 가지 함정이 있다. 되감기가 실패하면 그때는 정말로 사람이 필요하다. 이 경로는 재시도하지 않고 즉시 알림을 보낸다. 자동 복구가 자동 손상으로 바뀌는 지점이 거기다.
