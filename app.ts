// eslint-disable-next-line
require("dotenv").config()
import express from "express"
import { graphqlHTTP } from "express-graphql"
import { createApplication, createModule, gql } from "graphql-modules"
import { Directory, FileVersion, File } from "@prisma/client"
import { directoryModules } from "./directory"
import { fileModules } from "./file"
import { fileVersionModules } from "./fileVersion"
const mainModule = createModule({
  id: "main-module",
  dirname: __dirname,
  typeDefs: [
    gql`
      interface FileNode {
        id: ID!
        name: String!
        createdAt: String!
        updatedAt: String!
      }

      type Query {
        searchFiles(query: String!): [FileNode]
      }
    `,
  ],
  resolvers: {
    FileNode: {
      __resolveType(obj: File | FileVersion | Directory) {
        if (Object.prototype.hasOwnProperty.call(obj, "parentId")) {
          return "Directory"
        }
        if (Object.prototype.hasOwnProperty.call(obj, "fileId")) {
          return "FileVersion"
        }
        if (Object.prototype.hasOwnProperty.call(obj, "directoryId")) {
          return "File"
        }
      },
    },
    Query: {
      searchFiles: () => {
        return "FileVersion"
      },
    },
  },
})

const api = createApplication({
  modules: [mainModule, directoryModules, fileModules, fileVersionModules],
})

const app = express()

app.use(
  "/graphql",
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  graphqlHTTP({
    schema: api.schema,
    customExecuteFn: api.createExecution(),
    graphiql: process.env.NODE_ENV === "development",
  })
)

app.get("/", (_, res) => res.send("Hello World"))

app.listen(process.env.LOCAL_PORT ?? 4000, () => {
  console.log(`Application running on port ${process.env.LOCAL_PORT ?? 4000}.`)
})
