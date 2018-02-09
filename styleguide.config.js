module.exports = {
  theme: {
    color: {
      base: '#333',
      light: '#999',
      lightest: '#ccc',
      link: '#222',
      linkHover: '#f28a25',
      border: '#e8e8e8',
      name: '#7f9a44',
      type: '#b77daa',
      error: '#c00',
      baseBackground: '#fff',
      codeBackground: '#f5f5f5',
      sidebarBackground: '#888'
    },
    sidebarWidth: 280
  },
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