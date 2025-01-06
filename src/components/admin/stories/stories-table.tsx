"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"

interface Story {
  id: string
  title: string
  status: "published" | "draft"
  createdAt: string
}

const mockStories: Story[] = [
  {
    id: "1",
    title: "A História do React",
    status: "published",
    createdAt: "2024-03-20",
  },
  // Adicione mais histórias mock conforme necessário
]

export function StoriesTable() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Data de Criação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockStories.map((story) => (
            <TableRow key={story.id}>
              <TableCell className="font-medium">{story.title}</TableCell>
              <TableCell>
                <Badge variant={story.status === "published" ? "default" : "secondary"}>
                  {story.status === "published" ? "Publicado" : "Rascunho"}
                </Badge>
              </TableCell>
              <TableCell>{story.createdAt}</TableCell>
              <TableCell className="text-right">
                {/* Adicione ações aqui */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 