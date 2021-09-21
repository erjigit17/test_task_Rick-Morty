let queryChunks =[], temp =[], count = 0;
    
for (let i = 0; i < 671; i++) {
  temp.push(i)
  count++
  if (count == 9 ) {
    queryChunks.push(temp)
    temp = []
    count = 0
  }
}
!temp? null : queryChunks.push(temp)


console.log(queryChunks)