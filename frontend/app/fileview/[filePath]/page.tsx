'use client'

import { useEffect, useState } from "react"
import { JSONTree } from "react-json-tree"

export default function FileView({ params }: { params: { filePath: string } }) {
    const filePath = params.filePath
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState<any>()

    useEffect(() => {
        if(!filePath || filePath === "") return
        fetch(`http://localhost:8080/api/zipfile/` + filePath, {
            method: "GET", 
            cache: "no-store",
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok')
                }
                return response.json()
            })
            .then(data => {
                setContent(data)
            })
            .catch(error => console.error(error))
            .finally(() => setLoading(false))
    }, [])

    
    if (!filePath || filePath === "") return <div>
        ERRO
    </div>

    if(loading || !content) return <div>Carregando...</div>

    return (
        <div>
            <JSONTree data={content} />
        </div>
    )
}