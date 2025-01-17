package com.shop.back.member.service;

import com.shop.back.Role;
import com.shop.back.jwt.JwtAuthenticationFilter;
import com.shop.back.jwt.JwtTokenUtil;
import com.shop.back.member.dto.request.JoinRequest;
import com.shop.back.member.dto.request.LoginRequest;
import com.shop.back.member.dto.response.JoinResponse;
import com.shop.back.member.dto.response.LoginResponse;
import com.shop.back.member.entity.Member;
import com.shop.back.member.exception.MemberException;
import com.shop.back.member.repository.MemberRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;

    private final JwtAuthenticationFilter jwtAuthenticationFilter;



    public HttpStatus checkEmailDuplicate(String email) {
        isExistMemberEmail(email);
        return HttpStatus.OK;
    }

    @Transactional
    public JoinResponse join(JoinRequest req) {

        saveMember(req);
        authenticate(req.getEmail(), req.getPwd());

        return new JoinResponse(req.getEmail());
    }

    private void saveMember(JoinRequest req) {

        //  생년월일 String -> LocalDateTime
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        LocalDate localDate = LocalDate.parse(req.getBirthString(), formatter);

        LocalDateTime localDateTime = localDate.atTime(LocalTime.MIDNIGHT);
        req.setBirth(localDateTime);

        //이메일(아이디) 중복 확인
        isExistMemberEmail(req.getEmail());

        //패스워드 일치 확인
        checkPwd(req.getPwd(), req.getCheckPwd());

        //회원 정보 생성
        String encodePassword = encoder.encode(req.getPwd());
//        CreateMemberParam param = new CreateMemberParam(req, encodePassword);
        Member mb = new Member();
        mb.CreateMemberParam(req, encodePassword);

        Member result = memberRepository.save(mb);
        if (result.getId() == null) {
            throw new MemberException("회원 등록을 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public LoginResponse login(LoginRequest req) {

        Member member = memberRepository.findByEmail(req.getEmail());
        if (member.getRole() == Role.UNREGISTER) {
            throw new MemberException("탈퇴한 사용자입니다.", HttpStatus.FORBIDDEN);
        }

        authenticate(req.getEmail(), req.getPwd());

        final UserDetails userDetails = userDetailsService.loadUserByUsername(req.getEmail());
        final String accessToken = jwtTokenUtil.generateAccessToken(userDetails);
        final String refreshToken = jwtTokenUtil.generateRefreshToken(userDetails);

        System.out.println("Access Token: " + accessToken);
        System.out.println("Refresh Token: " + refreshToken);
        System.out.println("Email: " + req.getEmail());

        return new LoginResponse(accessToken, refreshToken, req.getEmail());
    }

    private void authenticate(String email, String pwd) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, pwd));
        } catch (DisabledException e) {
            throw new MemberException("인증되지 않은 이메일입니다.", HttpStatus.BAD_REQUEST);
        } catch (BadCredentialsException e) {
            throw new MemberException("비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        }
    }


    private void isExistMemberEmail(String email) {
        int result = 0;
//        Integer result = memberRepository.isExistMemberEmail(email);
        if (result == 1) {
            throw new MemberException("이미 사용 중인 이메일입니다.", HttpStatus.BAD_REQUEST);
        }
    }

    //회원가입 시 비밀번호 일치 확인
    private void checkPwd(String pwd, String checkPwd) {
        if (!pwd.equals(checkPwd)) {
            throw new MemberException("비밀번호가 일치하지 않습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    // 정보수정/탈퇴 - DB에 저장된 비밀번호 일치 확인
    public boolean checkPassword(Long id, String pwd) {
        Member member = memberRepository.findById(id).orElseThrow(() ->
                new MemberException("회원을 찾을 수 없습니다.", HttpStatus.NOT_FOUND));

        return encoder.matches(pwd, member.getPwd());
    }

    //정보 수정
    public boolean updateMember (Long id, String nickname, String pwd, LocalDateTime birth) {
        if (memberRepository.existsById(id)) {
            Member member = memberRepository.findById(id).get();
            if (nickname != null) {
                member.setNickname(nickname);
            }
            if (pwd != null) {
                member.setPwd(pwd);
            }
            if (birth != null) {
                member.setBirth(birth);
            }

            memberRepository.save(member);
            return true;
        } else {
            return false;
        }
    }

    //회원 탈퇴 (Role: UNREGISTER으로 변경)
    public boolean withdrawMember(String email) {
        //회원 정보 조회
        Member member = memberRepository.findByEmail(email);
        if (member != null) {
            member.setRole(Role.UNREGISTER);
            memberRepository.save(member);
            return true;
        } else {
            return false;
        }
    }


}


