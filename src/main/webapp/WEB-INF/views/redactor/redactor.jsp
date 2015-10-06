<%@ include file="../include/include.jsp" %>

<head>
    <title>Robots Diagram</title>

    <jsp:include page="../include/scripts.jsp" flush="true"/>

    <link rel="stylesheet" href="<c:url value='/resources/bootstrap/css/bootstrap.min.css' />"/>
    <link rel="stylesheet" href="<c:url value='/resources/css/joint.css' />"/>
    <link rel="stylesheet" href="<c:url value='/resources/css/base.css' />"/>
    <link rel="stylesheet" href="<c:url value='/resources/css/2dmodel.css' />" />
    <link rel="stylesheet" href="<c:url value='/resources/css/context-menu.css' />" />

    <link rel="stylesheet" href="<c:url value='/resources/treeview/jquery.treeview.css' />"/>
    <script type="text/javascript" src="<c:url value='/resources/treeview/jquery.treeview.js' />"></script>

    <link rel="stylesheet" href="<c:url value='/resources/css/jquery-ui.css' />"/>
</head>

<body ng-app ng-controller="RootDiagramController">
    <%@ include file="diagramContent.jsp" %>
    <%@ include file="2dmodelContent.jsp" %>
</body>
</html>