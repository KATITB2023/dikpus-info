import { FormControl, FormLabel, FormHelperText, Input, Button, Flex, useToast } from '@chakra-ui/react'
import { useState } from 'react';
import { useSession } from "next-auth/react";
import { api } from '~/utils/api';
import { TRPCClientError } from '@trpc/client';

export default function ChangePasswordForm() {
    const { data: session } = useSession();
    const toast = useToast();
    const changePassMutation = api.profile.changePass.useMutation();

    const [currentPass, setCurrentPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [confirmationPass, setConfirmationPass] = useState<string>('');

    const handleCurrentPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setCurrentPass(e.target.value);
    const handleNewPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setNewPass(e.target.value);
    const handleConfirmationPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setConfirmationPass(e.target.value);

    const isNewPassError = currentPass === newPass && newPass !== '';
    const isConfirmationPassError = confirmationPass != newPass && confirmationPass !== '';
    const isError = isNewPassError || isConfirmationPassError || currentPass === '' || newPass === '' || confirmationPass === '';

    const handleSubmitPass = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        console.log('submit password');
        try {
            const res = await changePassMutation.mutateAsync({
              userId: session?.user.id ?? '',
              curPass: currentPass,
              newPass: newPass,
              repeatPass: confirmationPass
            })

            toast({
                title: 'Success',
                status: 'success',
                description: res.message,
                duration: 3000,
                isClosable: true,
            });
        } catch (error: unknown){
            console.log("hmm")
            if (error instanceof TRPCClientError){
                console.log(error.message)
                toast({
                    title: 'Failed',
                    status: 'error',
                    description: error.message,
                    duration: 3000,
                    isClosable: true,
                });
            }
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
                <Button colorScheme="teal" type="submit" my={4}  _hover={{ bg: "#72D8BA" }} onClick={(e) => void handleSubmitPass(e)} isDisabled={isError}>
                    Submit
                </Button>
            </Flex>
        </form>
    );
}