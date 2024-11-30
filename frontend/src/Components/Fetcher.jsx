import React from 'react'

export default function Fetcher() {
    fetch('http://localhost:8000/getCords')
    .then(response => response.json())
    .then(data => console.log(data))
  return (
    <div>
      Hola
    </div>
  )
}
