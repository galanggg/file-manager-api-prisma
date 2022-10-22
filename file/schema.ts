import { createModule, gql } from "graphql-modules"
import { prismaClient } from "../prisma"
export const fileModules = createModule({
  id: "file-modules",
  dirname: __dirname,
  typeDefs: [
    gql`
      type File implements FileNode {
        id: ID!
        name: String!
        directoryId: ID!
        createdAt: String!
        updatedAt: String!
        versions: [FileVersion]!
      }

      extend type Query {
        getAllFiles: [File]!
      }
    `,
  ],
  resolvers: {
    Query: {
      getAllFiles: () => {
        return prismaClient().file.findMany()
      },
    },
  },
})
