# test-react (draft)

To launch : ``npm run dev``

## Components

```
<App>
	<Admin (if url="/admin")>
		<AdminUsers (if url="/admin/users")/>
	</Admin>
	<div (if url="/:loc")>
		<Auth (if url="/:loc/auth")>
			<Login (if url="/:loc/auth/login")/>
			<Register (if url="/:loc/auth/register")/>
			<ForgotPassword (if url="/:loc/auth/forgot")/>
		</Auth>
		<Main>
			<AuthButton/>
			<SplitPane>
				<MainPanel>
					<Map/>
					<Timeline/>
					<Previewer/>
				</MainPanel>
				<SidePanel>
					<Tabs>
						<Tab><Carousel/></Tab>
						<Tab><Layers/></Tab>
					</Tabs>
				</SidePanel>
			</SplitPane>
		</Main>
	</div>
</App>
```