import OpenAI from "openai";
import Mermaid from "react-mermaid2";
import { useState } from "react";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // This is the default and can be omitted
  dangerouslyAllowBrowser: true,
});

function App() {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [prompt, setPrompt] = useState("");
  const [mermaidCode, setMermaidCode] = useState("");
  const [description, setDescription] = useState("");

  const promptData = {
    model: "gpt-3.5-turbo-0613",
    messages: [
      {
        role: "system",
        content: "write the mermaid code for the provided user prompt.",
      },
      {
        role: "assistant",
        content: `Question: write me application flow diagram of auth module on login screen user is able to login upon successful login user will be navigated to /dashboard page user is also able to sign-up upon successful signup user will be redirected to /dashboard page, user is also able to reset password upon password reset user will be redirected to pin confirmation page and upon successfully providing pin user will be redirected to /dashboard page
        Working Syntax Answer: {
    "mermaidCode": "graph TD;\n\nAuthenticate[Authenticate] -->|Success| Navigate[Navigate to /dashboard page];\nAuthenticate -->|Failure| Signup[Signup];\nSignup -->|Success| Navigate;\nSignup -->|Failure| Reset[Reset Password];\nReset -->|Success| Pin[Pin Confirmation];\nPin -->|Success| Navigate;",
    "flowChartDescription": "Application flow diagram of the auth module"
}`,
      },
      {
        role: "assistant",
        content: `Question: 
create the diagram for the following web application infrastructure here is the flow
User accesses the application URL.
Route 53 directs traffic to CloudFront (if present) or the ELB.
ELB distributes traffic across healthy EC2 instances in the VPC.
EC2 instances serve static content directly from S3 or generate dynamic content using the application code.
For dynamic content, the application might access data from RDS, ElastiCache (if used), or DynamoDB (if used).
Lambda functions (if used) can be triggered by events (e.g., user actions) and interact with other services.
SNS (if used) can send notifications (e.g., emails) triggered by application events.
SQS (if used) can be used for asynchronous communication between application components or external services.
CloudWatch monitors application and infrastructure health, providing insights for troubleshooting.
IAM controls access to all resources, ensuring only authorized users can perform actions.

        Working Syntax Answer: {
    "mermaidCode": "graph TD;
User[User] -->|Accesses|Route53[Route 53];
Route53 -->|Directs Traffic|CloudFront[CloudFront];
Route53 -->|Directs Traffic|ELB[ELB];
CloudFront -->|Serves|EC2[EC2 Instances];
ELB -->|Distributes Traffic|EC2;
EC2 -->|Serves|S3[S3];
EC2 -->|Serves|ApplicationCode[Application Code];
EC2 -->|Accesses|RDS[RDS];
EC2 -->|Accesses|ElastiCache[ElastiCache];
EC2 -->|Accesses|DynamoDB[DynamoDB];
Lambda -->|Triggered by Events|OtherServices[Other Services];
SNS -->|Sends Notifications|Application[Application Events];
SQS -->|Asynchronous Communication|Application;
SQS -->|Asynchronous Communication|ExternalServices[External Services];
CloudWatch -->|Monitors|Health[Application Health];
CloudWatch -->|Monitors|Health[Infrastructure Health];
IAM -->|Controls Access|Resources[All Resources];",
    "flowChartDescription": "Here is your Application flow diagram"
}`,
      },
      { role: "user", content: prompt },
    ],
    functions: [
      {
        name: "getMermaidCode",
        description: "Get the Mermaid Code for the given flow chat prompt.",
        parameters: {
          type: "object",
          properties: {
            mermaidCode: {
              type: "string",
              description:
                "this should contain the complete Mermaid code for the requested flow chat or any other diagram type supported by Mermaid. Note don't use parenthesis and avoid '\n' as this code will be parsed by 'JSON.parse()'",
            },
            flowChartDescription: {
              type: "string",
              description:
                "this should contain the summarized description for the requested flow chat.",
            },
          },
          required: ["mermaidCode", "flowChartDescription"],
        },
      },
    ],
    function_call: "auto",
  };

  async function makeRequest() {
    setCode("");
    setDescription("");
    try {
      setLoading(true);
      const response = await openai.chat.completions.create(promptData);
      console.log({
        response,
        arguments: response?.choices?.[0]?.message?.function_call?.arguments,
      });
      const converted =
        response?.choices?.[0]?.message?.function_call?.arguments.replaceAll(
          "\n",
          ""
        );
      console.log({
        converted,
      });

      const data = JSON.parse(converted);
      console.log({ data });

      setCode(`${data?.mermaidCode}`);
      setDescription(data?.flowChartDescription);
      setLoading(false);
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      setLoading(false);
      alert("Something went wrong! Please try again.");
    }
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginRight: "5px",
            }}
          >
            <label htmlFor="prompt">Flow Chart Description</label>
            <textarea
              style={{ width: "600px", margin: "20px 0" }}
              type="text"
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
            />
            <button
              disabled={loading}
              style={{ width: "600px" }}
              onClick={() => {
                prompt && makeRequest();
              }}
            >
              {loading ? "Loading..." : "Generate Flow Chart"}
            </button>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <label htmlFor="prompt">Provide Mermaid Code</label>
            <textarea
              rows={5}
              type="text"
              style={{ width: "600px", margin: "20px 0" }}
              onChange={(e) => setMermaidCode(e.target.value)}
            />
            <button
              style={{ width: "600px" }}
              onClick={() => {
                setCode(`${mermaidCode}`);
              }}
            >
              {loading ? "Loading..." : "Generate Flow Chart"}
            </button>
          </div>
        </div>
        {code && (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  maxWidth: "80vw",
                  width: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    margin: "20px 0 0 ",
                  }}
                >
                  <span>Here is your flow chart:</span>

                  <button
                    onClick={() => {
                      navigator?.clipboard?.writeText?.(code);
                      window.open("https://app.diagrams.net", "_blank").focus();
                      // alert("Code copied to clipboard!");
                    }}
                  >
                    Copy Mermaid Code and open diagrams.net
                  </button>
                </div>
              </div>
            </div>
            <div>
              {description && (
                <p id="description" style={{ maxWidth: "600px" }}>
                  Description: {description}
                </p>
              )}
            </div>
            {code && <Mermaid chart={code} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;

// https://viewer.diagrams.net/?tags=%7B%7D&highlight=0000ff&edit=_blank&layers=1&nav=1#R1VvZVuNGEP0aPyan9%2BURGCDJZM4sZk4yj7Lc2ApC8tGC8Xx9StZi7JZJ%2B8RqAbtLLaG%2Bdfv2rRJM6NXj820WrJaf0rmJJwTNnyf0w4QQjDWDb1VkU0ckxXVgkUXzZtAuMI1%2BmiaImmgZzU2%2BN7BI07iIVvvBME0SExZ7sSDL0vX%2BsPs03v%2Btq2BhrMA0DGI7%2Blc0L5Z1VBG5i%2F9mosWy%2Fc1Y6PrIY9AObmaSL4N5un4RotcTepWlaVH%2F9Ph8ZeIKvBaX%2BrybI0e7G8tMUricMFv9%2BPxHGC3Lj%2BbznAYx%2FvrP7S8YNRN5CuKymfL33GTNLRebFof1MirMdBWE1es15HpCL%2FMiSx86WGBCl821TFaY56O3ibvJA2tM%2BmiKbANDmhMEbhiz6RBtAFzv8GfNXS9fQE%2Bb84Im44vu0jtQ4IcGl5MwUhZGF6tVHIVBEaUJHLgNCrMONuOBxrnYB40IYoGGBfWKmrZR%2B1lmBkIfy5nJElPAwiZoarKnCBAaDTys9T54VDAbPO2Vcq38vQTvy%2B8Q%2BBQkIDmP1dTGY5vEDoBRr2zD%2BCjbbsokrBZqPh5iiiIHxIj2ihg5itiHoAhmQT7impQHeDEhevASXvGiR%2FG6CsLliGARJhzQQswrWsxC6zJOZ5XeF2lWma7R4GLIhVyIe4WLH9H7yyB8MMl8t0%2BOqGKccwfghF%2FghAXc9dN2d0S3VYUxnoJJ8t9gaewVK9vrd4sRfS1NOeKi1K28vq74yCtePb4%2F3yThMkuTtKy8612QP4xpK%2FSB8HOhbNC4XyNm2%2F7p1z%2FfhqmQDmhhr0uS2D7%2Fm5lH%2BVswFcoBLeQXLdvkTwsowkOIXeS5KUZci5ar6MfLqwkjPRY%2FBAuR97iIsMyeTHU1vEUoyIqLqn0GgSRNYMwluJA2MovT8KEKPUfF3%2FAa%2FcoRFxxzzSVjQkHpXx%2F8sT2oFSeawfYjmERcbQ8mMMH2VCyIFgjuVmhNVXt0ey68yNIymW%2FvDHWZMnOra3eQJ5hbWmaheQ2etvcFk12Y4tWRqj%2F3mYmBfk%2F799KXx%2B2pAF%2FVJOoGrNIoaSj7Ms3d9f9P5u1i5Vta1g2Xuyy4v6%2FWzFkZgBCiYGMZhkQjBvlmao8EilOquILdCGjQQwICQckFZRxLEGp%2FJFDOJNDDkqC58pcq8EKH9YEOU4oOKFNf8swEsuu3gQnUpwPuEqK1xAoBeTCRPiXEmT0YDcue80uIXZIOygAMEgI5lkI0%2BnGwiQhNMSIcvlGpNT9kAMWaCSYolorsjr4pBhwxEMPqh9IHRbsn%2FbDr8u%2Fntx3g6RlREoRBgP2QVJ4kGiA14NqkpoLDV4%2BU0c6UIWNQpmvdd7U4JT4o0%2Fso8vxO1XYajoxhWiumJdcCXIwCtXmTlKHvbZ%2BxuywDpF0KBLsK5pISTVE1zZPSrhTVRHGJK7l5k2lnYygF44dNTj9KYfeY6uei5xcL21ieUNYi0Ivm3aMjaZ8dO5CGvzOtoHa77C6LFguTnTvzFHGphdAItglwGafphYITidaMI87AyHpMPXZOvRjFjOKDFqwfvaB233CILQYhromAzUUjBnXISZThVMIWxcDHVm8%2B1cKdMnIMymjrOZofytit0%2BskmMVnZ01v6t2diWBQEnPKoXCW2CNrnFun%2BL21TqndOq2ekm77HtUzrLNbDLsMdbYYUINwIlH9QT2mnzinf%2BCm6fnTbzc%2Bt0%2FiBkp%2Fb03pvPyZgg%2FwqPWnTwJQVwKQ99b3pHbfs1v%2FN9EQG0BPeXmCAmioNAjkn1DksTJt%2F77LgQADtz3dCQAvd39uXw%2Ff%2FdMCvf4X

// graph TD;    User[User] -->|Accesses|PublicIP[Public IP];    PublicIP -->|Routes Traffic|LoadBalancer[Load Balancer];    LoadBalancer -->|Distributes Traffic|AppGateway[Application Gateway];    LoadBalancer -->|Distributes Traffic|FrontDoor[Front Door];    LoadBalancer -->|Distributes Traffic|TrafficManager[Traffic Manager];    AppGateway -->|Routes Traffic|WebApp[Web App];    AppGateway -->|Routes Traffic|FunctionApp[Function App];    AppGateway -->|Routes Traffic|APIManagement[API Management];    WebApp -->|Serves|StaticContent[Static Content];    WebApp -->|Generates|DynamicContent[Dynamic Content];    WebApp -->|Accesses|Database[Database];    FunctionApp -->|Triggers by Events|Storage[Storage];    FunctionApp -->|Interacts with|ServiceBus[Service Bus];    FunctionApp -->|Interacts with|EventGrid[Event Grid];    APIManagement -->|Manages APIs|Microservices[Microservices];    APIManagement -->|Manages APIs|Functions[Functions];    Microservices -->|Accesses|Database;    Microservices -->|Accesses|Cache[Cache Service];    Microservices -->|Accesses|MessageBus[Message Bus];    Database -->|Stores Data|StorageAccount[Storage Account];    Database -->|Stores Data|SQLDatabase[SQL Database];    Database -->|Stores Data|CosmosDB[Cosmos DB];    Cache -->|Stores Data|RedisCache[Redis Cache];    MessageBus -->|Communicates|EventHub[Event Hub];    MessageBus -->|Communicates|ServiceBus;    StorageAccount -->|Stores Data|BlobStorage[Blob Storage];    StorageAccount -->|Stores Data|QueueStorage[Queue Storage];    StorageAccount -->|Stores Data|FileStorage[File Storage];    StorageAccount -->|Stores Data|TableStorage[Table Storage];    BlobStorage -->|Stores Blobs|StaticContent;    QueueStorage -->|Stores Queues|ServiceBus;    FileStorage -->|Stores Files|StaticContent;    TableStorage -->|Stores Tables|Database;    ContainerRegistry -->|Stores Containers|ContainerInstances[Container Instances];    ContainerInstances -->|Runs Containers|WebApp;    ContainerInstances -->|Runs Containers|FunctionApp;    VirtualNetwork -->|Connects Services|AppGateway;    VirtualNetwork -->|Connects Services|WebApp;    VirtualNetwork -->|Connects Services|FunctionApp;    VirtualNetwork -->|Connects Services|APIManagement;    VirtualNetwork -->|Connects Services|Database;    VirtualNetwork -->|Connects Services|StorageAccount;    VirtualNetwork -->|Connects Services|Microservices;    VirtualNetwork -->|Connects Services|ContainerInstances;    VirtualNetwork -->|Connects Services|PrivateEndpoint[Private Endpoint];    VirtualNetwork -->|Connects Services|VirtualNetworkGateway[Virtual Network Gateway];
