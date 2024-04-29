import { AuthContext } from '../context/AuthProvider'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CCardText,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
  cilSync,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import { AuthModeDispatch, AuthModeInfo } from 'src/layout/DefaultLayout'

const AppHeader = () => {
  const { auth, setAuth } = useContext(AuthContext)
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const mode = useContext(AuthModeInfo)
  const { changeMode } = useContext(AuthModeDispatch)
  const navigator = useNavigate()
  const change_mode = () => {
    if (mode === 'ADMIN') {
      changeMode('USER')
    } else if (mode === 'USER') {
      changeMode('ADMIN')
    }
  }

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const logout = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('accessToken')

    alert(auth + ' 계정이 로그아웃 되었습니다.')
    setAuth(null)

    navigator('/')
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        {/*<CHeaderToggler*/}
        {/*  onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}*/}
        {/*  style={{ marginInlineStart: '-14px' }}*/}
        {/*>*/}
        {/*  <CIcon icon={cilMenu} size="lg" />*/}
        {/*</CHeaderToggler>*/}
        <CHeaderNav className="d-none d-md-flex">
          {auth ? (
            <>
              {/* 로그인 상태일 때 보여줄 메뉴 */}
              <CNavItem>
                <CNavLink onClick={logout} style={{ cursor: 'pointer' }}>
                  로그아웃
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink to="/mypage" as={NavLink}>
                  마이페이지
                </CNavLink>
              </CNavItem>
            </>
          ) : (
            <>
              {/* 비로그인 상태일 때 보여줄 메뉴 */}
              <CNavItem>
                <CNavLink
                  onClick={() => {
                    navigator('/signup')
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  SignUp
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  onClick={() => {
                    navigator('/signin')
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  SignIn
                </CNavLink>
              </CNavItem>
            </>
          )}
          <CNavItem>
            <CNavLink to="/cart" as={NavLink}>
              장바구니
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CButton onClick={change_mode}>
              <CIcon icon={cilSync} size="lg" />
              {mode}
            </CButton>
          </CNavItem>
          {/* <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Users</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">Settings</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink onClick={() => {navigator('/signup')}} style={{cursor: 'pointer'}}>SignUp</CNavLink>
          </CNavItem>
            <CNavItem>
                <CNavLink onClick={() => {navigator('/signin')}} style={{cursor: 'pointer'}}>SignIn</CNavLink>
            </CNavItem>
          <CNavItem>
            <CButton onClick={change_mode}><CIcon icon={cilSync} size="lg" />{mode}</CButton>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}

          {/*<CHeaderNav>*/}
          {/*  <li className="nav-item py-1">*/}
          {/*    <div className="vr h-100 mx-2 text-body text-opacity-75"></div>*/}
          {/*  </li>*/}
          {/*  <CDropdown variant="nav-item" placement="bottom-end">*/}
          {/*    /!*<CDropdownToggle caret={false}>*!/*/}
          {/*    /!*  /!*{colorMode === 'dark' ? (*!/*!/*/}
          {/*    /!*  /!*  <CIcon icon={cilMoon} size="lg" />*!/*!/*/}
          {/*    /!*  /!*) : colorMode === 'auto' ? (*!/*!/*/}
          {/*    /!*  /!*  <CIcon icon={cilContrast} size="lg" />*!/*!/*/}
          {/*    /!*  /!*) : (*!/*!/*/}
          {/*    /!*  /!*  <CIcon icon={cilSun} size="lg" />*!/*!/*/}
          {/*    /!*  /!*)}*!/*!/*/}
          {/*    /!*  <CIcon icon={cilSun} size="lg" />*!/*/}
          {/*    /!*</CDropdownToggle>*!/*/}
          {/*    <CDropdownMenu>*/}
          {/*      <CDropdownItem*/}
          {/*        active={colorMode === 'light'}*/}
          {/*        className="d-flex align-items-center"*/}
          {/*        as="button"*/}
          {/*        type="button"*/}
          {/*        onClick={() => setColorMode('light')}*/}
          {/*      >*/}
          {/*        <CIcon className="me-2" icon={cilSun} size="lg" /> Light*/}
          {/*      </CDropdownItem>*/}
          {/*      <CDropdownItem*/}
          {/*        active={colorMode === 'dark'}*/}
          {/*        className="d-flex align-items-center"*/}
          {/*        as="button"*/}
          {/*        type="button"*/}
          {/*        onClick={() => setColorMode('dark')}*/}
          {/*      >*/}
          {/*        <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark*/}
          {/*      </CDropdownItem>*/}
          {/*      <CDropdownItem*/}
          {/*        active={colorMode === 'auto'}*/}
          {/*        className="d-flex align-items-center"*/}
          {/*        as="button"*/}
          {/*        type="button"*/}
          {/*        onClick={() => setColorMode('auto')}*/}
          {/*      >*/}
          {/*        <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto*/}
          {/*      </CDropdownItem>*/}
          {/*    </CDropdownMenu>*/}
          {/*  </CDropdown>*/}
          {/*  <li className="nav-item py-1">*/}
          {/*    <div className="vr h-100 mx-2 text-body text-opacity-75"></div>*/}
          {/*  </li>*/}
          {/*  <AppHeaderDropdown />*/}
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
