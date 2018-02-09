module.exports = {
  sections: [
  	{
  		name: 'Introduction',
  		content: 'docs/intro.md'
  	}, 
  	{
  		name: 'Redux',
  		sections: [
        {
          name: 'Store',
          content: 'docs/store.md'
        },
        {
          name: 'Actions',
          content: 'docs/actions.md'
        },
        {
          name: 'Selectors',
          content: 'docs/selectors.md'
        }
      ]
  	}, 
  	{
  		name: 'React',
  		content: 'docs/components.md',
  		sections: [
  			{
  				name: 'Common Components',
  				components: 'src/frontend/components/Common/**/[A-Z]*.js'
  			},
        {
          name: 'Admin Components',
          components: 'src/frontend/components/Admin/**/[A-Z]*.js'
        },
        {
          name: 'Authentication Components',
          components: 'src/frontend/components/Auth/**/[A-Z]*.js'
        },
        {
          name: 'Main Layout Components',
          components: 'src/frontend/components/Main/**/[A-Z]*.js'
        },
        {
          name: 'Map-related Components',
          components: 'src/frontend/components/Map/**/[A-Z]*.js'
        },
        {
          name: 'Media-related Components',
          components: 'src/frontend/components/Medias/**/[A-Z]*.js'
        },
        {
          name: 'Potree-related Components',
          components: 'src/frontend/components/Potree/**/[A-Z]*.js'
        }
  		]
  	}
  ],
  theme: {
    color: {
      base: '#333',
      light: '#999',
      lightest: '#ccc',
      link: '#333',
      linkHover: '#f28a25',
      border: '#e8e8e8',
      name: '#7f9a44',
      type: '#b77daa',
      error: '#c00',
      baseBackground: '#fff',
      codeBackground: '#f5f5f5',
      sidebarBackground: '#AAA',
    },
    sidebarWidth: 280,
    fontSize: {
      base: 15,
      text: 16,
      small: 13,
      h1: 48,
      h2: 36,
      h3: 24,
      h4: 18,
      h5: 16,
      h6: 16,
    }
  }
}