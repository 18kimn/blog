import type {ParamMatcher} from '@sveltejs/kit'

const match: ParamMatcher = (param) => {
  const patterns = [
    'atom',
    'feed',
    'atom.xml',
    'index.xml',
  ].join('|')
  return !!param.match(patterns)
}

export {match}
