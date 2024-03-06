// regex for headers, blockquotes, and lists (mind the trailing space): /^(#{1,6}|>|[0-9]+.|-) /g

type T_MdNode = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "bq" | "code" | "endcode" | "ul" | "ol" | "hr" | "img" | "br" | "br"

export type T_DocumentNode = {
  element: T_MdNode
  content: string | T_DocumentNode | { alt: string, url: string }
}

export type T_DocumentNodes = T_DocumentNode[]

const getNodeType:
(line: string) => T_MdNode =
(line: string) => {
  // br
  if (line === "") return "br"

  // hr
  if (line === "---") return "hr"

  // h1 - h6
  if (/^#{1,6} /g.test(line)) {
    const headerCount = line.match(/^#{1,6}/g)?.length
    switch (headerCount) {
      case 1: return "h1"
      case 2: return "h2"
      case 3: return "h3"
      case 4: return "h4"
      case 5: return "h5"
      case 6: return "h6"
      default: return "h1"
    }
  }

  // ol
  if (/^[0-9]+. /g.test(line)) return "ol"

  // ul
  if (/^- /g.test(line)) return "ul"



  return "p"
}

export const parseToObj:
(markdown: string) => T_DocumentNodes = 
(markdown: string) => {
  const lines: string[] = markdown.split("\n")
  const out: T_DocumentNodes = []

  let isParsingCode = false
  for (let i = 0; i < lines.length; i++) {
    /^(#{1,6}|>|[0-9]+.|-) /g.test(lines[i])
  }

  const tempDoc: T_DocumentNode = { element: "h1", content: "" }
  return [tempDoc]
}