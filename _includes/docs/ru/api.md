## API

### colibri.createResource(options)

Создает REST-ресурс.

**options**:

 - `mtimeField` - поле, в котором сохраняется время последнего изменения документа (по умолчанию false)
 - `ctimeField` - поле, в котором сохраняется время создания документа (по умолчанию false)
 - `upsert` - создавать ли документ в методе PUT, если документ с заданным `_id` не найден
 - `hooks` - набор пользовательских прослоек. Устаревшая опция, вместо неё используйте Resource#use().
 - `plainOutput` - по умолчанию результат запроса (`req.rest.result`) передаётся в свойстве `result` JSON-объекта. Это сделано для того, чтобы в остальных полях объекта можно было передать поля мета-данных из `req.rest.meta`. Если `plainOutput = true`, то результат запроса передаётся в корне JSON-объекта, без мета-данных. Если в качестве клиента вы используете `Backbone` (в базовом виде), то, скорее всего, вы захотите установить опцию `plainOutput` в `true`. Однако тогда вам будут недоступны мета-данные (которые могут содержать полезную информацию, переданную из плагинов, например поле `totalCount` из плагина count).

**возвращаемое значение**:

объект класса `Resource`

### Resource#use(plugin)

Добавляет плагин. Плагин - это набор прослоек (route middleware) Express, которые навешиваются после шагов/методов Colibri для изменения их функциональности.

Colibri на каждый запрос создаёт объект `req.rest`, через свойства которого можно управлять менять поведение REST-метода. Например, добавлять условия в запросы, проверять авторизацию, делать постраничную навигацию, скрывать/добавлять поля в результирующие объекты, выполнять логгирование, обновление связанных записей, и т.д.

Бизнес-логику приложения удобно оформлять в виде таких плагинов.

**plugin**:

Двухуровневый объект, в котором задаются прослойки, навешиваемые на определённые методы и шаги ресурса.

Имена свойств первого уровня соответствует именам методов, используемых в Colibri: `get`, `put`, `post`, `del` или `list`.

Имена свойств второго уровня - именам шагов соответсвующего метода: `begin`, `input`, `query`, `serialize`, `output` и пр.

Значения свойств второго уровня - это функции или массивы функций, представляющие собой стандартные прослойки маршрутов (route middleware) Express - функции или массивы функций, выполняющиеся **после** соответствующих шагов соответствующего метода/шага.

Так, например, если мы хотим добавить сортировку списка по определённому полю, мы должны написать такой плагин:

    resource.use({
        //list - имя метода
        list : {
            //query - имя шага.
            query : function (req, res, next) { //эта функция выполнится после шага query
                //В шаге list.query доступен объект req.rest.query,
                //представляющий собой Mongoose-запрос.

                //Добавляем параметр сортировки.
                req.rest.query.sort({my_field_name : 1});
                //Передаем управление дальше.
                next(null);
                //Следующим выполнится шаг load, который использует
                //req.rest.query для выборки документов
            }
        }
    });

Список доступных шагов, а также свойств `req.rest.*`, доступных для модификации, (TODO).


### Resource#express(app)

Добавляет созданный ресурс в Express-приложение.

Вызывайте этот метод **после** всех вызовов `Resource#use()`.