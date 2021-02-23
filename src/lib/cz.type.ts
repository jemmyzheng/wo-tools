export default {
  feat: {
    description: "新功能、旧功能的升级，意味着新代码。[测试，编译]",
    title: "Features"
  },
  fix: {
    description: "bug修复。[测试，编译]",
    title: "Bug Fixes"
  },
  docs: {
    description: "文本、注释修改",
    title: "Documentation"
  },
  style: {
    description: "不影响代码功能的格式化 (空格, 格式化, 缺少分号, 等等)。[测试]",
    title: "Styles"
  },
  refactor: {
    "description": "没有明确的bug修复或者新功能的增加以及旧功能的升级，也就是实在不知道这次改动是啥类型。[测试，编译]",
    "title": "Code Refactoring"
  },
  perf: {
    description: "性能优化。[测试，编译]",
    title: "Performance Improvements"
  },
  test: {
    description: "仅仅只是添加或修改测试代码。[测试]",
    title: "Tests"
  },
  build: {
    description: "影响项目构建或外部依赖的更改。 (如: maven, gradle, webpack, npm等配置文件)。[测试，编译]",
    title: "Builds"
  },
  ci: {
    description: "修改服务于CI的文件 (如: gitlab-ci.yml, Dockerfile等)。",
    title: "Continuous Integrations"
  },
  chore: {
    description: "其它不在src或者test目录的文件，(如：.gitignore, .eslintrc 等等)",
    title: "Chores"
  },
  revert: {
    description: "回退上一次提交。[测试，编译]",
    title: "Reverts"
  }
}
