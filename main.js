#!/usr/bin/env node

var inquirer = require('inquirer');
var CLI = require('clui');
var clear = require('clear');
var chalk = require('chalk');
var axios = require('axios');

const Spinner = CLI.Spinner;
const status = new Spinner('잠시만 기다려주세요...');
clear();

(async () => {
    const result = await inquirer.prompt([
        {
            name: 'birth',
            type: 'input',
            message: '당신이 태어난 날짜와 시간을 입력해주세요(yyyyMMddhhmm).',
            validate: function (val) {
                if (/\d{12}/.test(val)) {
                    return true;
                } else {
                    return '형식에 맞게 정확히 입력해주세요!';
                }
            }
        }
    ]);

    new Promise(resolve => {
        status.start();
        return setTimeout(resolve, 1000);
    }).then(() => {
        return axios.get(`http://server.is-fake.com/today?birth=${result.birth}`)
    }).then(({ data }) => {
        const today = data.result.today;
        console.log(`\n > 오늘은 ${
            today.year.gan.han + today.year.ji.han
        }년 ${
            today.month.gan.han + today.month.ji.han
        }월 ${
            today.day.gan.han + today.day.ji.han
        }일 입니다.`);
        console.log(` > ${data.result.text}`);
        status.stop();
    }).catch(error => {
        console.error(chalk.red('\nerror!'));
        status.stop();
    });
})();
