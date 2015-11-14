<%@ include file="../include/include.jsp" %>

<html>
<head>
    <title>Web-dsm</title>

    <jsp:include page="../include/scripts.jsp" flush="true"/>

    <link rel="stylesheet" href="<c:url value='/resources/bootstrap/css/bootstrap.min.css' />"/>
    <link rel="stylesheet" href="<c:url value='/resources/css/joint.css' />"/>
    <link rel="stylesheet" href="<c:url value='/resources/css/base.css' />"/>
    <link rel="stylesheet" href="<c:url value='/resources/css/context-menu.css' />" />

    <link rel="stylesheet" href="<c:url value='/resources/treeview/jquery.treeview.css' />"/>
    <script type="text/javascript" src="<c:url value='/resources/treeview/jquery.treeview.js' />"></script>

    <link rel="stylesheet" href="<c:url value='/resources/css/jquery-ui.css' />"/>
</head>

<body ng-app>
    <%@ include file="diagramContent.jsp" %>
</body>
</html>