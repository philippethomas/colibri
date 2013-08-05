utils = require './utils'

module.exports = class Method
  constructor : (@model, path=null, @options={}, verb, steps)->
    @verb = if verb? then verb else @defaultVerb()
    @plainOutput = !!@options.plainOutput

    unless @verb in ['all', 'get', 'post', 'put', 'del']
      throw new Error "Undefined verb '#{@verb}'"

    @path = if path? then path else @defaultPath()
    @steps = if steps? then steps else @defaultSteps()

    @routes = {}
    @autoAdd()

  defaultSteps : -> []
  defaultVerb  : -> 'all'
  defaultPath  : -> '/'
  successCode  : -> 200


  routesByStep : (step)->
    if @routes[step]
      return @routes[step]
    []

  autoAdd : ()->
    for step in @steps
      if toString.call(@[step]) == '[object Function]'
        @add step, @[step]

  use : (hooks)->
    for own step, middleware of hooks
      @add step, middleware

  add : (step, middleware)->
    unless @routes[step]
      @routes[step] = []
    @routes[step].push mw.bind @ for mw in utils.flatten [middleware]

  getVerb : ->
    return @verb

  getPath : ->
    return @path

  getMiddleware : ->
    return (@routesByStep step for step in @steps)

  begin : (req, res, next)=>
    req.rest = {}
    req.rest.meta = {}

    req.rest.model = @model
    req.rest.currentTime = new Date
    next null

  output : (req, res, next)=>
    if @plainOutput
      response = req.rest.result
    else
      response = req.rest.meta
      response.result = req.rest.result
    res.json response, @successCode()
