const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const logger = require('./logger'); 

app.use(cors());  // CORS 활성화


const db = mysql.createConnection({
  host: 'hostname',
  user: 'db user',
  password: 'db pw',
  database: 'db name'
});

db.connect();

app.use(express.json());

function choHangul(str) { 
    cho = ["ㄱ","ㄲ","ㄴ","ㄷ","ㄸ","ㄹ","ㅁ","ㅂ","ㅃ","ㅅ","ㅆ","ㅇ","ㅈ","ㅉ","ㅊ","ㅋ","ㅌ","ㅍ","ㅎ"]; 
    result = ""; 
    for(i=0;i<str.length;i++) { 
        code = str.charCodeAt(i)-44032; 
      if(code>-1 && code<11172) result += cho[Math.floor(code/588)]; 
    } 
    return result; 
  }
function bufferToString(buffer) {
    return Buffer.from(buffer).toString('utf-8');
}
app.get('/search', (req, res) => {
    const searchTerm = req.query.q;
    
    var keyword = searchTerm; 
    var choKeyword = choHangul(keyword); 
    
    //초성검색 구분 
    var IS_CHO = '';
    if (keyword!="" && choKeyword==""){ 
        IS_CHO = 'Y'; 
    }else{ 
        IS_CHO = 'N'; 
    }

    let query = 'SELECT * FROM TB_CODE WHERE 1 = 1';

    if (IS_CHO == 'Y') {
        query += ' AND FNC_NTCN(CODE_NM) LIKE CONCAT(?) ';
    } else {
        query += ' AND CODE_NM LIKE CONCAT(?)';
    } 
    logger.info("query :: " + query);

    db.query(query, [`%${keyword}%`], (err, results) => {
    if (err) throw err;
    const formattedResults = results.map(row => ({
        GROUP_CD: bufferToString(row.GROUP_CD),
        CODE_CD: bufferToString(row.CODE_CD),
        CODE_NM: bufferToString(row.CODE_NM),
        SORT: row.SORT,
        DESC: bufferToString(row.DESC)
      }));
  
      res.json(formattedResults);
    });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
