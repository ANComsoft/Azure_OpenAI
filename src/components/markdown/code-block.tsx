import { ClipboardIcon } from "lucide-react"
import { FC, memo } from "react"
import { Prism } from "react-syntax-highlighter"
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism"

import { APP_NAME } from "@/app-global"

import { showError, showSuccess } from "@/features/globals/global-message-store"
import { Button } from "@/features/ui/button"

export const fence = {
  render: "CodeBlock",
  attributes: {
    language: {
      type: String,
    },
    value: {
      type: String,
    },
  },
}

interface Props {
  language: string
  children: string
}

export const CodeBlock: FC<Props> = memo(({ language, children }): JSX.Element => {
  const handleCopy = async (): Promise<void> => {
    try {
      let attribution = `${language} code generated by ${APP_NAME}`

      if (language === "python") {
        attribution = `# ${language} code generated by ${APP_NAME}`
      } else if (["javascript", "typescript", "c", "java", "c++", "c#", "php"].includes(language)) {
        attribution = `// ${language} code generated by ${APP_NAME}`
      } else if (language === "html") {
        attribution = `<!-- ${language} code generated by ${APP_NAME} -->`
      }
      await navigator.clipboard.writeText(children + "\n" + attribution)
      showSuccess({ description: "Code copied." })
    } catch (err) {
      showError(`Failed to copy code: ${err}`)
    }
  }

  return (
    <div className="group relative z-20 size-full">
      <Prism language={language} style={atomDark} PreTag="pre">
        {children}
      </Prism>
      <Button
        onClick={handleCopy}
        className="absolute right-2 top-2 hidden h-7 gap-1 px-2 text-base capitalize focus:bg-accent focus:text-link group-hover:flex"
        title="Copy code"
      >
        <ClipboardIcon size={14} />
        Copy {language}
      </Button>
    </div>
  )
})

CodeBlock.displayName = "CodeBlock"
