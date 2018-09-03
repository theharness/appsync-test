export default `
mutation TestMutation($text: String!) {
  createTestMutation(text: $text) {
    text
    createdAt
  }
}
`