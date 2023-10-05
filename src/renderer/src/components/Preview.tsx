import ReactMarkDown from '@uiw/react-markdown-preview'
import './preview.css'
interface Props {
  doc: string
}
export default function Preview(props: Props) {
  return <ReactMarkDown className="preview markdown-body" source={props.doc} />
}
