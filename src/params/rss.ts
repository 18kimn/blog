import type {ParamMatcher} from '@sveltejs/kit'

const match: ParamMatcher = (param) => {
  const patterns = ['rss', 'rss.xml'].join('|')
  return !!param.match(patterns)
}

export {match}
