## инфо

https://sequelize.org/docs/v7/databases/postgres/ - документация sequelize + postgres

## для запуска

-   добавить енв для коннекта к БД, (локально можно запустить докер)
-   запуск самого приложения `npm run start`
-   далее в git-lab следует добавать webhook на url запущенного-текущего приложения, на события `Merge request events`, `Comments`; `SSL Verification` следует выключить `disabled`
