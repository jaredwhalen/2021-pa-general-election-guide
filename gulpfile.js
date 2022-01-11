require('dotenv').config()
const gulp = require('gulp');
const Gootenberg = require('gootenberg');
const credentials = require('./credentials.json');
const token = require('./token.json');
const fs = require("fs");
const gutil = require('gutil');
const ftp = require('vinyl-ftp');
const sleep = m => new Promise(r => setTimeout(r, m))
const download = require('gulp-download2');
var clean = require('gulp-clean');
var rename = require('gulp-rename');
var exec = require('child_process').exec;

async function archie(){
  const goot = new Gootenberg();
  await goot.auth.oauth(credentials, token);
  //console.log(data);
  const archie_json = await goot.parse.archie('1oXOjuDU-zdpK_hlbzup8IpchP6q0wgjUVsh5HbSl-_0');

  const parseLinks = (text) => {
    let output;
    var objectRegExp = /\[([^)]+)\)/;
    var stringRegExp = /\[([^)]+)\]/;
    var urlRegExp = /\(([^)]+)\)/;

    var matches = objectRegExp.exec(text);
    if (matches) {
      matches.map(match => {
        let string = stringRegExp.exec(match)
        let url = urlRegExp.exec(match)
        if (string && url) {
          let replacement = `<a target="_blank" class='g-link' href="${url[1]}">${string[1]}</a>`
          text = text.replace(match, replacement)
          output = text
        }
      })
    }
    return(output)
  }



archie_json.meta.introText = parseLinks(archie_json.meta.introText)
archie_json.meta.candidateResponseDisclaimer = parseLinks(archie_json.meta.candidateResponseDisclaimer)

  fs.writeFile('./src/data/archie.json', JSON.stringify(archie_json), function(err) {
    if (err) {
      console.log('Unable to write to file: '+ filename);
    }
  });
}

exports.archie = archie

async function gsheet(){
  const goot = new Gootenberg();
  await goot.auth.oauth(credentials, token);

  const gsheet_json = await goot.parse.table('1lbsiUYDggZUFHe3zAuZDJMBnR1ZhGqhcrc8oalFrdtY');
  // gsheet_json_contested = gsheet_json.data.filter(d => d.contested)
  fs.writeFile('./src/data/gsheet.json', JSON.stringify(gsheet_json.data), function(err) {
    if (err) {
      console.log('Unable to write to file: '+ filename);
    }
  });
}

exports.gsheet = gsheet

async function asyncForEach(array, callback) {

  // setTimeout(function(){ alert("Hello"); }, 3000);
  for (let index = 0; index < array.length; index++) {
    // await sleep(30000)
    await sleep(500)
    await callback(array[index], index, array);
  }
}

async function gforms(){
  const goot = new Gootenberg();
  await goot.auth.oauth(credentials, token);
  const formSheets = await goot.drive.ls('1qCXJTmd1PK80PpXlVY8QmEeHYhaCiujt');
  const responsesArr = []
  const bioArr = []
  const responsesCheck = []

  const sleep = ms => new Promise(r => setTimeout(r, ms))

  asyncForEach(formSheets, async (f) => {

    await sleep(10000);

    const format = str => str.replace(/ /g, '_').replace(/,/g,"").toLowerCase()
    let s = await goot.parse.table(f.id);
    let rows = s['Form Responses 1']
    rows.forEach(row => {

      let columnLimitIndex = 11

      let candidateCode = format(`${row['Office sought']} ${row['Candidate']}`)
      let keys = Object.keys(row).slice(columnLimitIndex)

      // let keys = Object.keys(row).filter(k => k.includes('Q:'))
      let responses = keys.map(k => {

          return {
            candidateCode,
            question: k,
            response: !!row[k] ? row[k].split(/\n/g) : ''
          }
      })

      console.log(responses)

      responsesArr.push(...responses)

      let bioResponse = {
        candidateCode: candidateCode,
        email: row['Email Address'],
        dob: row['Date of birth'],
        website: row['Campaign website'],
        twitter: row['Twitter account'],
        facebook: row['Campaign Facebook page'],
        occupation: row['Occupation'],
        residence: row['Township of residence'] || row['Primary residence municipality ']
      }


      bioArr.push(bioResponse)
      responsesCheck.push(candidateCode)

    })

    fs.writeFile('./src/data/questionnaire.json', JSON.stringify(responsesArr), function(err) {
      if (err) {
        console.log('Unable to write to file: ' + filename);
      }
    });
    fs.writeFile('./src/data/bioResponses.json', JSON.stringify(bioArr), function(err) {
      if (err) {
        console.log('Unable to write to file: '+ filename);
      }
    });
    fs.writeFile('./workspace/responses.json', JSON.stringify(responsesCheck), function(err) {
      if (err) {
        console.log('Unable to write to file: '+ filename);
      }
    });

  })
}

exports.gforms = gforms




const user = process.env.FTP_USER;
const pwd = process.env.FTP_PWD;

const localBuild = [
    './build/**/*',
];

// const remoteLocation = 'projects/testing';
const remoteLocation = 'projects/2020-pa-general-election';

function getFtpConnection(){
    return ftp.create({
        host: 'ftp-content.gbahn.net',
        port: 21,
        user: user,
        password: pwd,
        parallel: 5,
        log: gutil.log
    })
}

//deploy to remote server
gulp.task('deploy',function(){
    var conn = getFtpConnection();
    return gulp.src(localBuild, {base: '.', buffer: false})
        .pipe(conn.newer(remoteLocation))
        .pipe(conn.dest(remoteLocation))
})
