"use server"

import { testAction, read } from "./actions";

export default async function Page() {
  const readD = await read()

  
  return (
    <div>
      <h1>testing</h1>
      <form action={testAction}>
        <button>test</button>
      </form>
      {readD?.data.reverse().map((d, n) => {
        return (
          <div key={n}>
            {d.content}
          </div>
        )
      })}
    </div>
  )
}