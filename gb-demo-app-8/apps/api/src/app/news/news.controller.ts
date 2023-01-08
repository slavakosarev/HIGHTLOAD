import { Body, Controller, Get, Header, Post, Param } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import Redis from 'ioredis';
import memjs from 'memjs';

const memcached = memjs.Client.create();
const redis = new Redis();

export class CreateNewsDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

@Controller('news')
export class NewsController {
  @Get()
  async getNews() {
    return new Promise(resolve => {

      const authors = ['Анохин', 'Астахов', 'Бабушкин', 'Беликов', 'Белкин', 'Беспалов', 'Вдовин', 'Вешняков', 'Волошин', 'Воронков', 'Демьянов', 'Ежов', 'Еремеев', 'Жаров', 'Жилин', 'Капустин', 'Карташов', 'Касьянов', 'Козин', 'Кондратов', 'Косарев', 'Кулагин', 'Малахов', 'Павловский', 'Пугачев', 'Русанов', 'Савицкий', 'Сизов', 'Сотников', 'Сухарев', 'Сухов', 'Толкачев', 'Усов', 'Хромов', 'Худяков', 'Чижов'];

      const news = Object.keys([...Array(20)])
        .map(key => Number(key) + 1)
        .map(n => ({
          id: n,
          title: `Важная новость ${n}`,
          author: authors[Math.floor(Math.random() * authors.length)],
          description: (rand => ([...Array(rand(1000))]
            .map(() => rand(10 ** 16)
              .toString(36)
              .substring(rand(10)))
            .join(' ')))(max => Math.ceil(Math.random() * max)),
          createdAt: Date.now()
        }));

      news.forEach((item) => {
        redis.hset(
          `news`,
          `news:${item['id']}`,
          JSON.stringify({
            id: item['id'],
            title: `Важная новость ${item['id']}`,
            author: authors[Math.floor(Math.random() * authors.length)],
            description: ((rand) =>
              [...Array(rand(1000))]
                .map(() =>
                  rand(10 ** 16)
                    .toString(36)
                    .substring(rand(10))
                )
                .join(' '))((max) => Math.ceil(Math.random() * max)),
            createdAt: Date.now(),
          })
        );
      });


      setTimeout(() => {
        redis.hgetall('news', function (err, obj) {

          const newObj = [];
          for (const key in obj) {
            newObj.push(JSON.parse(obj[key]))
          }
          return resolve(newObj)
        })
      }, 100);
    });
  }

  @Get('top-ten')
  async topTen() {
    return new Promise((resolve) => {
      redis.hgetall('news', function (err, obj) {

        const newObj = [];
        const authorCount = [];
        for (const key in obj) {
          newObj.push(JSON.parse(obj[key]))
          authorCount.push(JSON.parse(obj[key]).author)
        }

        const authorRate = {};

        authorCount.forEach((item) => {
          if (authorRate[item]) {
            authorRate[item] += 1;
          }
          else {
            authorRate[item] = 1
          }
        });

        const sortable = Object.keys(authorRate);

        sortable.sort(function (a, b) { return authorRate[b] - authorRate[a] });
        return resolve(`топ-10 авторов: ${sortable.slice(0, 10).join(', ')}`);
      });
    })
  }

  @Post()
  @Header('Cache-Control', 'none')
  create(@Body() peaceOfNews: CreateNewsDto) {
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('Новость успешно создана', peaceOfNews);
        resolve({ id: Math.ceil(Math.random() * 1000), ...peaceOfNews });
      }, 100)
    });
  }

  @Get('test-memcached/:searchtext')
  async testMemcached(@Param('searchtext') searchtext: string) {
    memcached.set("foo", searchtext, 10);

    return await memcached.get("foo").then(a => a.value.toString());
  }

  @Get('test-redis/:searchtext')
  async testRedis(@Param('searchtext') searchtext: string) {
    redis.set("foo", searchtext);

    return await redis.get("foo");
  }
}
