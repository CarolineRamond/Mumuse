# test-react (draft)

To launch : ``npm run dev``

## Components

```
<App>
	<Admin (if url="/admin")>
		<Users (if url="/admin/users")/>
			<UsersTable/>
			<UsersCreate (if url="/admin/users/create")/>
			<UsersEdit (if url="/admin/users/edit/:userId")/>
			<UsersDelete (if props.confirmDelete)/>
		</Users>
	</Admin>
	<div (if url="/:loc")>
		<Auth (if url="/:loc/auth")>
			<Login (if url="/:loc/auth/login")/>
			<Register (if url="/:loc/auth/register")/>
			<ForgotPassword (if url="/:loc/auth/forgot")/>
			<ResetPassword (if url="/:loc/auth/reset")/>
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
						<Tab>
							<Carousel/>
							<MediasActions (if user is admin)/>
						</Tab>
						<Tab><Layers/></Tab>
					</Tabs>
				</SidePanel>
			</SplitPane>
		</Main>
	</div>
</App>
```