export default `
subscription TestSub($text: String!) {
  onCreateTestMutation(text: $text) {
    text
    createdAt
  }
}
`