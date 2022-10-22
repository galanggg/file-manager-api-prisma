import { createModule, gql } from "graphql-modules"
import { prismaClient } from "../prisma"
export const fileVersionModules = createModule({
  id: "fileVersion-modules",
  dirname: __dirname,
  typeDefs: [
    gql`
      type FileVersion implements FileNode {
        id: ID!
        name: String!
        mimetype: String!
        size: Int!
        fileId: ID!
        createdAt: String!
        updatedAt: String!
      }

      extend type Query {
        getAllFileVersions: [FileVersion]!
      }
    `,
  ],
  resolvers: {
    Query: {
      getAllFileVersions: () => {
        return prismaClient().fileVersion.findMany()
      },
    },
  },
})
