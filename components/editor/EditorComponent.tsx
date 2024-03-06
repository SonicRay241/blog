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
  sandpackPlugin,
  frontmatterPlugin,
  diffSourcePlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  CreateLink,
  DiffSourceToggleWrapper,
  InsertCodeBlock,
  useCodeBlockEditorContext,
  type CodeBlockEditorDescriptor
} from "@mdxeditor/editor"
import {FC} from 'react'
import { langs } from "./codeblocklang"
import { TextareaAutosize } from "@mui/material"



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
  Editor: (props) => {
    const cb = useCodeBlockEditorContext()
   // stops the proppagation so that the parent lexical editor does not handle certain events.
    return (
      <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
        <TextareaAutosize className="w-full resize-none outline-none" defaultValue={props.code} onChange={(e) => cb.setCode(e.target.value)} />
      </div>
    )
  }
}


/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs. 
*/
const Editor: FC<EditorProps> = ({ markdown, editorRef }) => {
  return (
    <MDXEditor 
      ref={editorRef}
      markdown={markdown}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        // toolbarPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: 'js', codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor]}),
        codeMirrorPlugin({
          codeBlockLanguages: langs,
          theme: atomDark
        }),
        tablePlugin(),
        imagePlugin(),
        linkPlugin(),
        frontmatterPlugin(),
        diffSourcePlugin(),
        markdownShortcutPlugin(),
        // toolbarPlugin({
        //   toolbarContents: () => (
        //     <>
        //       {' '}
        //       <UndoRedo />
        //       <BoldItalicUnderlineToggles />
        //       <CreateLink/>
        //       <CodeToggle/>
        //       <InsertCodeBlock/>
              
        //     </>
        //   )
        // })
      ]}
    />
  )
}

export default Editor