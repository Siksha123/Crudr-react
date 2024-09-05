import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import Swal from 'sweetalert2';
const EditProfile = () => {
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth);
    const [loading, setLoading] = useState(false);
    const [input, setInput] = useState({
        profilePhoto: user?.profilePicture,
        bio: user?.bio,
        gender: user?.gender
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        if (file) setInput({ ...input, profilePhoto: file });
    }

    const selectChangeHandler = (value) => {
        setInput({ ...input, gender: value });
    }

    const editProfileHandler = async () => {
        const formData = new FormData();
        formData.append("bio", input.bio);
        formData.append("gender", input.gender);
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:3000/api/v1/user/profile/edit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedUserData = {
                    ...user,
                    bio: res.data.user?.bio,
                    profilePicture: res.data.user?.profilePicture,
                    gender: res.data.user.gender
                };
                dispatch(setAuthUser(updatedUserData));
                navigate(`/profile/${user?._id}`);
                Swal.fire({
                    icon: 'Update Profile Successfully..',
                    title: 'Success',
                    text: res.data.message,
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='flex max-w-3xl mx-auto p-8'>
            <section className='flex flex-col gap-6 w-full'>
                <h1 className='font-bold text-2xl mb-4'>Edit Profile</h1>
                <div className='flex items-center justify-between bg-gray-100 rounded-xl p-4 shadow-md'>
                    <div className='flex items-center gap-4'>
                        <Avatar>
                            <AvatarImage src={user?.profilePicture} alt="profile_picture" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className='font-semibold text-lg'>{user?.username}</h1>
                            <span className='text-gray-600'>{user?.bio || 'Bio here...'}</span>
                        </div>
                    </div>
                    <input ref={imageRef} onChange={fileChangeHandler} type='file' className='hidden' />
                    <Button onClick={() => imageRef?.current.click()} className='bg-[#0095F6] h-10 hover:bg-[#318bc7] text-white font-semibold rounded-md transition-colors'>Change photo</Button>
                </div>
                <div className='space-y-4'>
                    <div>
                        <h1 className='font-semibold text-xl mb-2'>Bio</h1>
                        <Textarea value={input.bio} onChange={(e) => setInput({ ...input, bio: e.target.value })} name='bio' className="focus-visible:ring-transparent border rounded-md p-2 w-full" />
                    </div>
                    <div>
                        <h1 className='font-semibold mb-2'>Gender</h1>
                        <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
                            <SelectTrigger className="w-full border rounded-md">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className='flex justify-end mt-6'>
                    {loading ? (
                        <Button className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd] text-white font-semibold rounded-md'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button onClick={editProfileHandler} className='w-fit bg-[#0095F6] hover:bg-[#2a8ccd] text-white font-semibold rounded-md'>Submit</Button>
                    )}
                </div>
            </section>
        </div>
    )
}

export default EditProfile;
