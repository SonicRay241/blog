'use client'

import { 
  MDXEditor, 
  MDXEditorMethods, 
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  tablePlugin,
  imagePlugin,
  linkPlugin,
  frontmatterPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  InsertCodeBlock,
  type CodeBlockEditorDescriptor,
  CodeMirrorEditor,
  InsertImage,
  InsertTable,
  linkDialogPlugin,
} from "@mdxeditor/editor"
import {FC} from 'react'
import { langs } from "./codeblocklang"
import { encode } from "base64-arraybuffer"
import { url } from "@/libs/url"
import { getCookie } from "cookies-next"

const atomDark = {
  "colors": {
    "surface1": "#282c34",
    "surface2": "#21252b",
    "surface3": "#2c313c",
    "clickable": "#a8b1c2",
    "base": "#a8b1c2",
    "disabled": "#4d4d4d",
    "hover": "#e8effc",
    "accent": "#c678dd",
    "error": "#e06c75",
    "errorSurface": "#ffeceb"
  },
  "syntax": {
    "plain": "#a8b1c2",
    "comment": {
      "color": "#757575",
      "fontStyle": "italic"
    },
    "keyword": "#c678dd",
    "tag": "#e06c75",
    "punctuation": "#a8b1c2",
    "definition": "#62aeef",
    "property": "#d19a66",
    "static": "#a8b1c2",
    "string": "#98c379"
  },
  "font": {
    "body": "-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\"",
    "mono": "\"Fira Mono\", \"DejaVu Sans Mono\", Menlo, Consolas, \"Liberation Mono\", Monaco, \"Lucida Console\", monospace",
    "size": "13px",
    "lineHeight": "20px"
  }
}

interface EditorProps {
  markdown: string
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>
}



const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
  // always use the editor, no matter the language or the meta of the code block
  match: (language, meta) => true,
  // You can have multiple editors with different priorities, so that there's a "catch-all" editor (with the lowest priority)
  priority: 0,
  // The Editor is a React component
  Editor: CodeMirrorEditor
}


/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs. 
*/
const Editor: FC<EditorProps & { setState?: (s: string) => void, enableSaveBtn?: (b: boolean) => void, readOnly?: boolean }> = (props) => {
  return (
    <MDXEditor 
      ref={props.editorRef}
      markdown={props.markdown}
      onChange={(s) => {
        if (props.setState)
        props.setState(s)
        if (props.enableSaveBtn)
        props.enableSaveBtn(true)
      }}
      suppressHtmlProcessing={false}
      placeholder="Type markdown here..."
      readOnly={props.readOnly}
      plugins={[
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4, 5, 6] }),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        linkPlugin(),
        linkDialogPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js', codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor]}),
        codeMirrorPlugin({
          codeBlockLanguages: langs,
          theme: atomDark
        }),
        tablePlugin(),
        imagePlugin({
          imageUploadHandler: async (image) => {
            const imageBuffer = await image.arrayBuffer()
            const b64 = encode(imageBuffer)
            const res = "data:image/png;base64, " + b64
            return new Promise<string>((resolve, reject) => {
                resolve(res);
            })
          },
        }),
        frontmatterPlugin(),
        diffSourcePlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarContents: () => (
            <div className="flex-wrap fixed bottom-2 left-1/2 -translate-x-1/2 flex justify-center p-1 h-fit bg-gray-100 border border-gray-200 drop-shadow-sm rounded-md">
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <CreateLink/>
              <CodeToggle/>
              <InsertCodeBlock/>
              <InsertImage/>
              <InsertTable/>
            </div>
          )
        })
      ]}
    />
  )
}

export default Editor