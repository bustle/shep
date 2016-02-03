module.exports = `{
  "headers": {
  #foreach( $key in $input.params().header.keySet() )
    "$key": "$util.escapeJavaScript($input.params().header.get($key))"#if( $foreach.hasNext ),#end
  #end
  },
  "pathParameters": {
  #foreach( $key in $input.params().path.keySet() )
    "$key": "$util.escapeJavaScript($input.params().path.get($key))"#if( $foreach.hasNext ),#end
  #end
  },
  "queryParameters": {
  #foreach( $key in $input.params().querystring.keySet() )
    "$key": "$util.escapeJavaScript($input.params().querystring.get($key))"#if( $foreach.hasNext ),#end
  #end
  },
  "body": $input.json('$')
}`
