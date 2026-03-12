import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui/Tabs"
import AuthForm from '@/features/authentication/ui/AuthForm'
import RegForm from '@/features/authentication/ui/RegistrationForm'

function AuthPage() {

    return (
        <main className="flex justify-center items-center px-[100px] py-[15px] bg-[#FAFAFA] w-full h-full grow">
            <div className='bg-white rounded-md border-slate-200 w-[27.25rem] border px-4 py-5 h-fit'>
                <div>
                    <Tabs defaultValue='authentication' className='w-full'>
                        <TabsList className='w-full rounded-md h-11'>
                            <TabsTrigger value="authentication">Authentication</TabsTrigger>
                            <TabsTrigger value="registration">Registration</TabsTrigger>
                        </TabsList>
                        <TabsContent value="authentication">
                            <AuthForm />
                        </TabsContent>
                        <TabsContent value="registration">
                            <RegForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </main>
     );
}

export default AuthPage;