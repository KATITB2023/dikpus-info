import { FormControl, FormLabel, FormHelperText, Input, Button, Flex } from '@chakra-ui/react'
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { api } from '~/utils/api';

export default function ChangePasswordForm() {
    const { data: session } = useSession();
    const changePassMutation = api.profile.changePass.useMutation();

    const [currentPass, setCurrentPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [confirmationPass, setConfirmationPass] = useState<string>('');

    const handleCurrentPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setCurrentPass(e.target.value);
    const handleNewPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setNewPass(e.target.value);
    const handleConfirmationPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setConfirmationPass(e.target.value);

    const isNewPassError = currentPass === newPass && newPass !== '';
    const isConfirmationPassError = confirmationPass != newPass && confirmationPass !== '';
    const isError = isNewPassError || isConfirmationPassError;

    const handleSubmitPass = async () => {
        console.log('submit password');
        try {
            const res = await changePassMutation.mutateAsync({
              userId: session?.user.id ?? '',
              curPass: currentPass,
              newPass: newPass,
              repeatPass: confirmationPass
            })
            // TO DO: success toast
        } catch (error){
            console.log(error)
            // TO DO: error toast
        }
    }

    return (
        <form>
            <FormControl mb={6}>
                <FormLabel>Current Password</FormLabel>
                <Input type='password' value={currentPass} onChange={handleCurrentPassChange} isRequired/>
            </FormControl>
            <FormControl my={6}>
                <FormLabel>New Password</FormLabel>
                <Input type='password' value={newPass} onChange={handleNewPassChange} isRequired/>
                {isNewPassError && <FormHelperText color='red'>New password is the same as current password</FormHelperText>}
            </FormControl>
            <FormControl my={6}>
                <FormLabel>New Password Confirmation</FormLabel>
                <Input type='password' value={confirmationPass} onChange={handleConfirmationPassChange} isRequired/>
                {isConfirmationPassError && <FormHelperText color='red'>Confirmation password is different with new password</FormHelperText>}
            </FormControl>
            <Flex justify='center'>
                <Button colorScheme="teal" type="submit" my={4}  _hover={{ bg: "#72D8BA" }} onClick={() => void handleSubmitPass} isDisabled={isError}>
                    Submit
                </Button>
            </Flex>
        </form>
    );
}