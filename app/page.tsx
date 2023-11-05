"use client"
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react"
import loader from "@monaco-editor/loader"
import { saveAs } from "file-saver"
import * as monaco from "monaco-editor"
import { useEffect, useRef, useState } from "react"

export default function App() {
  const [file, setFile] = useState<File>()
  const [fileName, setFileName] = useState<string>("")
  const [value, setValue] = useState<string>()
  const [language, setLanguage] = useState<string>("plaintext")
  const [allLanguages, setAllLanguages] = useState<any[]>([])
  const [languagesAssociations, setLanguagesAssociations] = useState<{
    [key: string]: string
  }>({})

  const openRef = useRef<HTMLInputElement>(null)
  const saveRef = useRef<HTMLInputElement>(null)

  function saveFile() {
    saveAs(
      new Blob([value || ""]),
      fileName?.includes(".")
        ? fileName
        : `${fileName || "file"}.${
            Object.keys(languagesAssociations)[
              Object.values(languagesAssociations).findIndex(
                (association) => association === language
              )
            ]
          }`
    )
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.ctrlKey && event.key === "s") {
      event.preventDefault()
      saveFile()
    }
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress)

    return () => {
      document.removeEventListener("keydown", handleKeyPress)
    }
  }, [])

  useEffect(() => {
    loader.init().then((monaco) => {
      const allLanguages = monaco.languages.getLanguages()
      setAllLanguages(allLanguages)
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
      setFileName(file.name)
      reader.readAsText(file)
      const extension = file.name.split(".").pop() || ""
      setLanguage(languagesAssociations[extension])
    }
  }, [file, languagesAssociations])

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
      monaco.editor.create(containerRef.current!, {
        value: value || "ASDFASDFASDFASDFSF",
        language,
        theme: "vs-dark",
      })
  }, [])

  return (
    <Flex height={"100dvh"} flexDirection={"column"}>
      <Center
        padding={5}
        position={"relative"}
        justifyContent={"space-between"}
      >
        <Heading
          position={"absolute"}
          left={"50%"}
          transform={"translateX(-50%)"}
        >
          CodeX
        </Heading>
        <Flex gap={5}>
          <Button onClick={() => openRef.current?.click()}>
            Загрузить файл
          </Button>
          <Select
            width={"20dvw"}
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value)
            }}
          >
            {allLanguages?.map((language, index) => (
              <option
                style={{ backgroundColor: "#1e1e1e" }}
                value={language.id}
                key={index}
              >
                {language.aliases && language.aliases[0]}
              </option>
            ))}
          </Select>
        </Flex>
        <Flex gap={5}>
          <Input
            width={"20dvw"}
            type={"text"}
            value={fileName}
            placeholder={"File name"}
            onChange={(event) => setFileName(event.target.value)}
          />
          <Button onClick={() => saveRef.current?.click()}>
            Сохранить файл
          </Button>
        </Flex>
      </Center>
      {/* <Editor language={language} value={value} theme={"vs-dark"} /> */}
      <Box ref={containerRef} />
      <Input
        type={"file"}
        display={"none"}
        ref={openRef}
        onChange={(event) => {
          event.target.files && setFile(event.target.files[0])
        }}
      />
      <Input
        type={"text"}
        display={"none"}
        ref={saveRef}
        onClick={() => saveFile()}
      />
    </Flex>
  )
}
