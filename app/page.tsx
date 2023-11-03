"use client"
import { Box, Button, Code, Flex, Input } from "@chakra-ui/react"
import loader from "@monaco-editor/loader"
import Editor from "@monaco-editor/react"
import { saveAs } from "file-saver"
import { useEffect, useRef, useState } from "react"

export default function App() {
  const [file, setFile] = useState<File>()
  const [value, setValue] = useState<string>()
  const [language, setLanguage] = useState("plaintext")
  const [languagesAssociations, setLanguagesAssociations] = useState(
    {} as { [key: string]: string }
  )

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loader.init().then((monaco) => {
      const allLanguages = monaco.languages.getLanguages()
      const extensions = allLanguages
        .map(
          ({ id, extensions }) =>
            extensions &&
            extensions.map((extension) => ({
              [extension.replace(".", "")]: id,
            }))
        )
        .flat()
        .filter((i): i is { [key: string]: string } => !!i)
        .reduce((acc, obj) => ({ ...acc, ...obj }))

      setLanguagesAssociations(extensions || {})
    })
  }, [])

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onload = async ({ target: { result } }: any) => {
        setValue(result)
      }
      reader.readAsText(file)
      const extension = file.name.split(".").pop() || ""
      setLanguage(languagesAssociations[extension])
    }
    console.log(file?.name)
  }, [file, languagesAssociations])

  return (
    <Flex height={"100dvh"} flexDirection={"column"}>
      <Box>
        <Button onClick={() => inputRef.current?.click()}>
          Загрузить файл
        </Button>
        <Input
          type="file"
          display={"none"}
          ref={inputRef}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            event.target.files && setFile(event.target.files[0])
          }}
        />
        <Button onClick={() => saveAs(new Blob([value || ""]), file?.name)}>
          Сохранить файл
        </Button>
      </Box>
      <Editor language={language} value={value} theme={"vs-dark"} />
      <Code />
    </Flex>
  )
}
