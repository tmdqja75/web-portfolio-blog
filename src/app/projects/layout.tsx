import { preload } from "react-dom"

import { projects } from "./data"

export default function ProjectsLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  for (const project of projects) {
    preload(project.image, { as: "image" })
  }

  return (
    <>
      {children}
      {modal}
    </>
  )
}
