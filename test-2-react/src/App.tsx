import React from 'react';
import { useEffect, useState } from 'react';
import { Route, Switch, Redirect, BrowserRouter, useHistory } from 'react-router-dom';
import ProceedLoginPage from './ProceedLoginPage';

export default function App() {
    return (
        <BrowserRouter>
            <header className="h-20 bg-primary flex items-center p-4">
                <h1 className="text-3xl text-black">Title</h1>
            </header>
            
            <main className="flex flex-col p-4 h-full">
                <Switch>
                    <Route path="/login/step-1" component={LoginPage} />
                    <Route path="/login/step-2" render={(props) => <ProceedLoginPage email="example@email.com" {...props} />} />
                    <Redirect from="/" to="/login/step-1" />
                </Switch>
            </main>
        </BrowserRouter>
    );
}

function LoginPage() {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isButtonPressed, setIsButtonPressed] = useState(false);
    const [timer, setTimer] = useState(0);

    useEffect(() => {
        setIsValidEmail(isValidEmailFormat(email));
        localStorage.setItem('savedEmail', email);
        return () => {
            clearInterval(intervalRef.current!);
        };
    }, [email]);

    const intervalRef = React.useRef<number | undefined>(undefined);

    const isValidEmailFormat = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        setIsValidEmail(isValidEmailFormat(newEmail));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setIsChecked(checked);
    };

    const handleButtonPress = () => {
        setIsButtonPressed(true);
        setTimer(0);

        intervalRef.current = window.setInterval(() => {
            setTimer((prevTimer) => prevTimer + 100);
        }, 100);
    };

    const handleButtonRelease = () => {
        clearInterval(intervalRef.current!);

        if (isButtonPressed && timer >= 500 && isValidEmail && isChecked) {
            history.push({
                pathname: '/login/step-2',
                state: { email }
            });
        } else {
            setTimer(0);
        }

        setIsButtonPressed(false);
    };

    return (
        <Switch>
            <Route>
                <FormInput onChange={handleEmailChange} value={email} />
                <div className="p-1"></div>
                <FormCheckbox onChange={handleCheckboxChange} isChecked={isChecked} />
                <button
                    className="btn btn-primary mt-auto"
                    onMouseDown={handleButtonPress}
                    onMouseUp={handleButtonRelease}
                    onTouchStart={handleButtonPress}
                    onTouchEnd={handleButtonRelease}
                    disabled={!isValidEmail || !isChecked}
                >
                    Hold to proceed ({Math.max(0, 500 - timer)} ms)
                </button>
            </Route>
            <Route>Not implemented</Route>
        </Switch>
    );
}

function FormCheckbox({ onChange, isChecked }: { onChange: (checked: boolean) => void; isChecked: boolean }) {
    return (
        <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
                <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={isChecked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <span className="label-text">I agree</span>
            </label>
        </div>
    );
}

export function FormInput({ onChange, value, readOnly }: { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; value: string; readOnly?: boolean }) {
    return (
        <label className="form-control">
            <div className="label">
                <span className="label-text">Email</span>
            </div>
            <input
                type="text"
                placeholder="Type here"
                className="input"
                onChange={onChange}
                value={value}
                readOnly={readOnly}
            />
        </label>
    );
}
