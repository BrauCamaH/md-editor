export default interface Api {
  readFile: () => Promise<any>
  writeFile: (args: any) => Promise<any>
  saveAs: (args: { content: string }) => Promise<any>
}
