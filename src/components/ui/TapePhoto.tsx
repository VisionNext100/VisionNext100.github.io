import './TapePhoto.css'

type Props = {
  src: string
  alt: string
}

export function TapePhoto({ src, alt }: Props) {
  return (
    <div className="tape-photo">
      <span className="tape-photo__tape tape-photo__tape--left" aria-hidden="true" />
      <span className="tape-photo__tape tape-photo__tape--right" aria-hidden="true" />
      <img src={src} alt={alt} className="tape-photo__img" />
    </div>
  )
}
