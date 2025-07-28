export interface Snippet {
  _id: string;
  title: string;
  description?: string;
  code: string;
  technology: Technology;
  useCase: UseCase;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export type Technology =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "php"
  | "csharp"
  | "cpp"
  | "go"
  | "rust"
  | "sql"
  | "html"
  | "css"
  | "react"
  | "vue"
  | "angular"
  | "nodejs"
  | "express"
  | "django"
  | "laravel"
  | "dotnet";

export type UseCase =
  | "crud"
  | "auth"
  | "database"
  | "api"
  | "validation"
  | "upload"
  | "email"
  | "date"
  | "error-handling"
  | "middleware"
  | "hooks"
  | "components"
  | "styling"
  | "testing"
  | "deployment";
