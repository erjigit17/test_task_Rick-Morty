import getCount from './counter'
import parser from './parser'

async function start(){
  const pages = await getCount()
  const data = await parser(pages)
}
start()