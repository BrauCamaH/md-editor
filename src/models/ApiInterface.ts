export default interface Api {
  readFile: () => Promise<any>
  writeFile: (args: any) => Promise<any>
  saveAs: (args: { name: string; content: string }) => Promise<any>
}
