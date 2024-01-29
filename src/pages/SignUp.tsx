import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [accountType, setAccountType] = useState("buyer");
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordConfirmValid, setPasswordConfirmValid] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setNickname("");
      setAccountType("buyer");
    };
  }, []);

  useEffect(() => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;
    setPasswordValid(passwordRegex.test(password));
  }, [password]);

  useEffect(() => {
    setPasswordConfirmValid(password === confirmPassword);
  }, [password, confirmPassword]);

  const signupHandler = async () => {
    setEmailError("");
    setNicknameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!passwordConfirmValid) {
      setConfirmPasswordError("입력하신 비밀번호와 다릅니다.");
      return;
    }

    if (!passwordValid) {
      setPasswordError(
        "비밀번호는 영문자, 숫자, 특수문자 모두 포함한 8~20자여야 합니다."
      );
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const newUser = {
        userId: userCredential.user.uid,
        email: email,
        isSeller: accountType === "seller",
        nickname: nickname,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const collectionRef = collection(db, "users");
      await addDoc(collectionRef, newUser);

      navigate("/home");
    } catch (error) {
      const errorCode = (error as { code?: string }).code;
      if (errorCode === "auth/email-already-in-use") {
        setEmailError("이미 사용 중입니다. 다른 이메일을 입력해주세요.");
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <h2>회원가입 페이지</h2>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="email">이메일</Label>
        <Input
          type="email"
          id="email"
          placeholder="이메일을 입력해 주세요"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError("");
          }}
        />
        {emailError && <div>{emailError}</div>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 relative">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          type={showPassword ? "text" : "password"}
          id="password"
          placeholder="영문자, 숫자, 특수문자 포함 최소 8~20자 "
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
        >
          {showPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fillRule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
            </svg>
          )}
        </button>
        {passwordError && <div>{passwordError}</div>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5 relative">
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          type={showConfirmPassword ? "text" : "password"}
          id="confirmPassword"
          placeholder="비밀번호를 다시 입력해 주세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
        >
          {showConfirmPassword ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
              <path
                fillRule="evenodd"
                d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
              <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
              <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
            </svg>
          )}
        </button>
        {confirmPasswordError && <div>{confirmPasswordError}</div>}
      </div>

      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="nickname">사용자 이름</Label>
        <Input
          type="text"
          id="nickname"
          placeholder="이름을 입력해 주세요"
          value={nickname}
          onChange={(e) => {
            setNickname(e.target.value);
            setNicknameError("");
          }}
        />
        {nicknameError && <div>{nicknameError}</div>}
      </div>

      <Label>회원 구분</Label>
      <ToggleGroup
        type="single"
        value={accountType}
        onValueChange={setAccountType}
      >
        <ToggleGroupItem value="seller">판매자</ToggleGroupItem>
        <ToggleGroupItem value="buyer">구매자(일반 고객)</ToggleGroupItem>
      </ToggleGroup>

      <Button onClick={signupHandler}>회원가입 완료하기</Button>
    </div>
  );
};

export default SignUp;
