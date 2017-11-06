# test-react (draft)

To launch : ``npm run dev``

## Components

``<App>
	<Main (if url="/:loc")>
		<Auth (if url="/:loc/auth")>
			<Login (if url="/:loc/auth/login")/>
			<Register (if url="/:loc/auth/register")/>
			<ForgotPassword (if url="/:loc/auth/forgot")/>
		</Auth>
		<Layout>
			<AuthButton/>
			<SplitPane>
				<MapScreen>
					<Map/>
					<Timeline/>
					<Previewer/>
				</MapScreen>
				<SidePannel>
					<Tabs>
						<Tab><Carousel/></Tab>
						<Tab><Layers/></Tab>
					</Tabs>
				</SidePannel>
			</SplitPane>
		</Layout>
	</Main>
	<Admin (if url="/admin")>
		<AdminUsers (if url="/admin/users")/>
	</Admin>
</App>``