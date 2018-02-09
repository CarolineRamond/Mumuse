module.exports = {
  sections: [
  	{
  		name: 'Introduction',
  		content: 'docs/intro.md'
  	}, 
  	{
  		name: 'Redux Store',
  		content: 'docs/redux.md'
  	}, 
  	{
  		name: 'Components',
  		content: 'docs/components.md',
  		sections: [
  			{
  				name: 'Common Components',
  				components: 'src/frontend/components/Common/**/[A-Z]*.js'
  			}
  		]
  	}
  ]
}