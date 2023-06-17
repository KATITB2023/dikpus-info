import { FormControl, FormLabel, FormHelperText, Input, Button, Flex } from '@chakra-ui/react'
import { useState, useEffect } from 'react';

export default function ChangePasswordForm() {
    const [currentPass, setCurrentPass] = useState<string>('');
    const [newPass, setNewPass] = useState<string>('');
    const [confirmationPass, setConfirmationPass] = useState<string>('');

    const handleCurrentPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setCurrentPass(e.target.value);
    const handleNewPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setNewPass(e.target.value);
    const handleConfirmationPassChange: React.ChangeEventHandler<HTMLInputElement> = (e) => setConfirmationPass(e.target.value);

    const isNewPassError = currentPass === newPass && newPass !== '';
    const isConfirmationPassError = confirmationPass != newPass && confirmationPass !== '';
    const isError = isNewPassError || isConfirmationPassError;

    const handleSubmitPass: React.MouseEventHandler<HTMLButtonElement> = () => {
        // TO DO
        console.log('submit password');
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
                <Button colorScheme="teal" type="submit" my={4}  _hover={{ bg: "#72D8BA" }} onClick={handleSubmitPass} isDisabled={isError}>
                    Submit
                </Button>
            </Flex>
        </form>
    );
}