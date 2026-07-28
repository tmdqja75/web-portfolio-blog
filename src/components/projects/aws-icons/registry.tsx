import { LambdaIcon } from "./lambda"
import { ApiGatewayIcon } from "./api-gateway"
import { RdsIcon } from "./rds"
import { SqsIcon } from "./sqs"
import { S3Icon } from "./s3"

type IconComponent = React.ComponentType<{
  className?: string
  x?: number
  y?: number
  width?: number
  height?: number
}>

export const AWS_ICONS: Record<string, IconComponent> = {
  lambda: LambdaIcon,
  "api-gateway": ApiGatewayIcon,
  rds: RdsIcon,
  sqs: SqsIcon,
  s3: S3Icon,
}
