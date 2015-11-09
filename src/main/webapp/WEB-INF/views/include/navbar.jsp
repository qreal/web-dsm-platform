<%@ include file="include.jsp" %>

<link rel="stylesheet" href="<c:url value='/resources/bootstrap/css/bootstrap.min.css' />"/>

<c:url value="/j_spring_security_logout" var="logout"/>
<div id="top-nav" class="navbar navbar-inverse navbar-static-top">
    <div class="container-fluid">
        <div class="navbar-collapse collapse">
            <ul class="nav navbar-nav">

                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown">Redactor<b class="caret"></b></a>
                    <ul class="dropdown-menu">
                        <li><a href="<c:url value="/redactor"/>">Redactor</a></li>
                    </ul>
                </li>

            </ul>

            <ul class="nav navbar-nav navbar-right">

                <sec:authorize access="isAuthenticated()">

                    <li>
                        <a href="${logout}">
                            <i class="glyphicon glyphicon-lock"></i>
                            Logout
                        </a>
                    </li>
                    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
                </sec:authorize>
            </ul>

        </div>
    </div>
    <!-- /container -->
</div>
<!-- /Header -->